// js/core/AssetLoader.js
// Asset loading utilities

export class AssetLoader {
  constructor() {
    this.loadedAssets = new Map();
    this.loadingPromises = new Map();
  }

  async loadImage(url, alias) {
    if (this.loadedAssets.has(alias)) {
      return this.loadedAssets.get(alias);
    }

    if (this.loadingPromises.has(alias)) {
      return this.loadingPromises.get(alias);
    }

    const promise = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.loadedAssets.set(alias, img);
        this.loadingPromises.delete(alias);
        resolve(img);
      };
      img.onerror = () => {
        this.loadingPromises.delete(alias);
        reject(new Error(`Failed to load image: ${url}`));
      };
      img.src = url;
    });

    this.loadingPromises.set(alias, promise);
    return promise;
  }

  async loadAudio(url, alias) {
    if (this.loadedAssets.has(alias)) {
      return this.loadedAssets.get(alias);
    }

    if (this.loadingPromises.has(alias)) {
      return this.loadingPromises.get(alias);
    }

    const promise = new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.oncanplaythrough = () => {
        this.loadedAssets.set(alias, audio);
        this.loadingPromises.delete(alias);
        resolve(audio);
      };
      audio.onerror = () => {
        this.loadingPromises.delete(alias);
        reject(new Error(`Failed to load audio: ${url}`));
      };
      audio.src = url;
    });

    this.loadingPromises.set(alias, promise);
    return promise;
  }

  async loadJSON(url, alias) {
    if (this.loadedAssets.has(alias)) {
      return this.loadedAssets.get(alias);
    }

    if (this.loadingPromises.has(alias)) {
      return this.loadingPromises.get(alias);
    }

    const promise = fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        this.loadedAssets.set(alias, data);
        this.loadingPromises.delete(alias);
        return data;
      })
      .catch(error => {
        this.loadingPromises.delete(alias);
        throw error;
      });

    this.loadingPromises.set(alias, promise);
    return promise;
  }

  getAsset(alias) {
    return this.loadedAssets.get(alias);
  }

  hasAsset(alias) {
    return this.loadedAssets.has(alias);
  }

  clearCache() {
    this.loadedAssets.clear();
    this.loadingPromises.clear();
  }
}

// Singleton instance
export const assetLoader = new AssetLoader();

