import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Posts as PostService } from '../../services/posts';
import { Post, PostInput } from '../../models/post.model';

@Component({
  selector: 'app-panel',
  imports: [FormsModule],
  templateUrl: './panel.html',
  styleUrl: './panel.css'
})
export class Panel {

  posts = signal<Post[]>([]);
  editingId = signal<number | null>(null);
  private servicio = inject(PostService);

  idEdicion: number | null = null;

  formulario = {
    userId: 0,
    title: '',
    body: '',
  };

  ngOnInit(): void {
    this.cargarPosts();
  }



  cargarPosts() {
    this.servicio.obtenerPosts().subscribe({
      next: (datos) => {
        this.posts.set(datos);
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
      }
    });
  }


  form: PostInput = { userId: 0, title: '', body: '' };

  save(): void {

    if (!this.form.title || !this.form.body) {
      return;
    }
    const id = this.editingId();
    if (id === null) {
      this.create();
    } else {
      this.update(id);
    }
  }

  private create(): void {
    this.servicio.crearPost(this.form).subscribe({
      next: (posts) => {
        this.posts.update((list) => [posts, ...list]);
        this.cancel();
      },
    });
  }


  private update(id: number): void {
    this.servicio.actualizarPost(id, this.form).subscribe({
      next: (posts) => {
        this.posts.update((list) =>
          list.map((item) => (item.id === id ? { ...item, ...posts } : item))
        );
      },
    });
  }


  guardarPost() {

    const datos = { ...this.formulario };

    if (this.idEdicion !== null) {

      const id = this.idEdicion;

      this.servicio.actualizarPost(id, datos).subscribe({
        next: () => {

          this.posts.update(lista =>
            lista.map(p =>
              p.id === id ? { ...p, ...datos } : p
            )
          );

          alert('Producto actualizado');
          this.cancelarEdicion();
        },
        error: (error) => console.error(error)
      });

    } else {

      this.servicio.crearPost(datos).subscribe({
        next: (post) => {

          this.posts.update(lista => [
            post,
            ...lista
          ]);

          alert('Producto creado');
          this.cancelarEdicion();
        },
        error: (error) => console.error(error)
      });
    }
  }


  edit(product: Post): void {
    this.editingId.set(product.id);
    this.form = { ...product };
  }


  cancel(): void {
    this.editingId.set(null);
    this.form = { userId: 0, title: '', body: '' };
  }


  editarPost(post: Post) {

    this.idEdicion = post.id;

    this.formulario = {
      userId: post.userId,
      title: post.title,
      body: post.body,
    };
  }


  borrarPost(id: number) {

    if (!confirm('¿Deseas borrar este post?')) {
      return;
    }

    this.servicio.borrarPost(id).subscribe({
      next: () => {

        this.posts.update(lista =>
          lista.filter(post => post.id !== id)
        );

        alert('Post borrado');
      },
      error: (error) => console.error(error)
    });
  }

  cancelarEdicion() {
    this.idEdicion = null;

    this.formulario = {
      userId: 0,
      title: '',
      body: ''
    };
  }
}

