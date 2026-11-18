import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post, PostInput } from '../models/post.model';

@Injectable({ providedIn: 'root' })
export class Posts {

  private readonly url = 'https://jsonplaceholder.typicode.com/posts';

  private readonly http = inject(HttpClient);

  obtenerPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.url);
  }

  // CREAR PRODUCTO
    crearPost(post: PostInput){
    return this.http.post<Post>(this.url, post);

    }

    // actualizar producto 
    actualizarPost(id: number, post: PostInput){
    return this.http.put<Post>(`${this.url}/${id}`, post);

    }

    // Borrar producto
    borrarPost(id: number){
    return this.http.delete<Post>(`${this.url}/${id}`);
    }

}