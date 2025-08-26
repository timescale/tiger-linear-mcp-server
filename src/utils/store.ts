interface StoreProps<T> {
  contents?: T;
  fetch: () => Promise<T[]>;
}

export class Store<T> {
  private contents: Promise<T[]> | null = null;
  private fetch: StoreProps<T>['fetch'];

  constructor({ fetch }: StoreProps<T>) {
    this.fetch = fetch;
  }

  async get(): Promise<T[]> {
    this.contents ??= this.fetch();

    return this.contents;
  }

  async find(predicate: (item: T) => boolean): Promise<T | null> {
    const items = await this.get();
    return items.find(predicate) ?? null;
  }
}
