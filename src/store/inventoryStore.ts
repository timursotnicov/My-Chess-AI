import { create } from 'zustand';
import {
  InventoryItem,
  CollectionState,
  ItemDefinition,
} from '../types';
import { ITEMS } from '../data/items';
import { COLLECTIONS } from '../data/collections';
import { eventBus } from '../systems/eventBus';

interface InventoryStoreState {
  inventory: InventoryItem[];
  collections: CollectionState[];

  addItem: (itemId: string, quantity?: number) => void;
  removeItem: (itemId: string, quantity?: number) => boolean;
  hasItem: (itemId: string, quantity?: number) => boolean;
  getItemCount: (itemId: string) => number;
  getItemDef: (itemId: string) => ItemDefinition | undefined;
  checkCollections: () => void;
  setInventory: (inventory: InventoryItem[]) => void;
  setCollections: (collections: CollectionState[]) => void;
}

const createInitialCollections = (): CollectionState[] =>
  COLLECTIONS.map((c) => ({
    id: c.id,
    foundItems: [],
    isCompleted: false,
  }));

export const useInventoryStore = create<InventoryStoreState>((set, get) => ({
  inventory: [],
  collections: createInitialCollections(),

  addItem: (itemId: string, quantity = 1) => {
    const { inventory } = get();
    const existing = inventory.find((i) => i.itemId === itemId);
    const itemDef = ITEMS.find((i) => i.id === itemId);

    if (existing && itemDef?.stackable) {
      const maxStack = itemDef.maxStack || 99;
      set({
        inventory: inventory.map((i) =>
          i.itemId === itemId
            ? { ...i, quantity: Math.min(i.quantity + quantity, maxStack) }
            : i,
        ),
      });
    } else {
      set({
        inventory: [
          ...inventory,
          { itemId, quantity, acquiredAt: Date.now() },
        ],
      });
    }

    eventBus.emit('item_acquired', { itemId, quantity });
    get().checkCollections();
  },

  removeItem: (itemId: string, quantity = 1) => {
    const { inventory } = get();
    const existing = inventory.find((i) => i.itemId === itemId);
    if (!existing || existing.quantity < quantity) return false;

    if (existing.quantity === quantity) {
      set({ inventory: inventory.filter((i) => i.itemId !== itemId) });
    } else {
      set({
        inventory: inventory.map((i) =>
          i.itemId === itemId ? { ...i, quantity: i.quantity - quantity } : i,
        ),
      });
    }
    return true;
  },

  hasItem: (itemId: string, quantity = 1) => {
    const item = get().inventory.find((i) => i.itemId === itemId);
    return (item?.quantity ?? 0) >= quantity;
  },

  getItemCount: (itemId: string) => {
    const item = get().inventory.find((i) => i.itemId === itemId);
    return item?.quantity ?? 0;
  },

  getItemDef: (itemId: string) => ITEMS.find((i) => i.id === itemId),

  checkCollections: () => {
    const { inventory, collections } = get();
    const ownedIds = new Set(inventory.map((i) => i.itemId));
    let changed = false;

    const newCollections = collections.map((col) => {
      if (col.isCompleted) return col;

      const colDef = COLLECTIONS.find((c) => c.id === col.id);
      if (!colDef) return col;

      const foundItems = colDef.itemIds.filter((id) => ownedIds.has(id));
      const isCompleted = foundItems.length === colDef.itemIds.length;

      if (isCompleted && !col.isCompleted) {
        changed = true;
        eventBus.emit('collection_completed', { collectionId: col.id });
      }

      return {
        ...col,
        foundItems,
        isCompleted,
        completedAt: isCompleted ? Date.now() : col.completedAt,
      };
    });

    if (changed) {
      set({ collections: newCollections });
    }
  },

  setInventory: (inventory: InventoryItem[]) => set({ inventory }),
  setCollections: (collections: CollectionState[]) => set({ collections }),
}));
