export interface Post 
{
    userId: number;
    id: number;
    title: string;
    body: string;
}

export type PostInput = Pick<Post, 'userId' | 'title' | 'body'>;