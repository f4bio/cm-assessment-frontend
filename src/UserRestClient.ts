export interface User {
  id?: number; // the fuck?
  name: string;
  email: string;
  password: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * REST client for the user resource.
 */
export class UserRestClient {
  private baseUrl: string;

  public constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public async loadItemById(id: number): Promise<User | null> {
    const response = await fetch(this.baseUrl + "/user/" + id?.toString(), {
      method: "GET",
    });

    if (response.status >= 400) {
      const data = await response.json();
      throw new Error("Server error: " + data.message);
    }

    return await response.json();
  }

  public async loadAllItems(): Promise<User[]> {
    const response = await fetch(this.baseUrl + "/user", {
      method: "GET",
    });

    if (response.status >= 400) {
      const data = await response.json();
      throw new Error("Server error: " + data.message);
    }

    return await response.json();
  }

  public async insertItem(item: User): Promise<User> {
    const response = await fetch(this.baseUrl + "/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });

    if (response.status >= 400) {
      const data = await response.json();
      throw new Error("Server error: " + data.message);
    }

    return await response.json();
  }

  public async updateItem(item: User): Promise<User> {
    const response = await fetch(
      this.baseUrl + "/user/" + item.id?.toString(),
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      },
    );

    if (response.status >= 400) {
      const data = await response.json();
      throw new Error("Server error: " + data.message);
    }

    return await response.json();
  }

  public async deleteItemById(id: number): Promise<void> {
    const response = await fetch(this.baseUrl + "/user/" + id?.toString(), {
      method: "DELETE",
    });

    if (response.status >= 400) {
      const data = await response.json();
      throw new Error("Server error: " + data.message);
    }
  }
}
