export abstract class IStorageService {
	/**
	 * Stores the given `data` for the given `key`.
	 *
	 * @param key The key.
	 * @param data The data.
	 */
	abstract storeData(key: string, data: any): Promise<void>;

	/**
	 * Returns the stored data for the given `key` or null if no data.
	 *
	 * @param key The key of the stored data.
	 */
	abstract getData<T>(key: string): Promise<T>;

	/**
	 * Checks if there is data for the given `key`.
	 *
	 * @param key The key that is to be checked.
	 */
	abstract hasKey(key: string): Promise<boolean>;

	/**
	 * Clears the storage and deletes **all** stored data.
	 */
	abstract clear(): Promise<void>;

	/**
	 * Removes the given `key` and its data from the storage.
	 *
	 * @param key The key that is to be removed.
	 */
	abstract remove(key: string): Promise<void>;
}
