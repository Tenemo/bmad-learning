export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TodoListResponse {
  items: Todo[];
}

export interface TodoCreateInput {
  text: string;
}

export interface TodoUpdateInput {
  text?: string;
  completed?: boolean;
}
