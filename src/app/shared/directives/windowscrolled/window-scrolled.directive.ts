import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: '[appWindowScrolled]'
})
export class WindowScrolledDirective {
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private router: Router
  ) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.scrollY;
    const navbar = this.el.nativeElement;
    const currentPath = this.router.url;

    if (currentPath === '/dreamhome') {
      if (scrollPosition > navbar.offsetHeight) {
        this.renderer.setStyle(navbar, 'background-color', 'var(--bs-nav-bg-color)');
        this.renderer.setStyle(navbar, 'padding-block', '1rem');
      } else {
        this.renderer.setStyle(navbar, 'background-color', 'transparent');
        this.renderer.setStyle(navbar, 'padding-block', '1.25rem');
      }
    } else {
      this.renderer.setStyle(navbar, 'background-color', 'var(--bs-nav-bg-color)');
      if (scrollPosition > navbar.offsetHeight) {
        this.renderer.setStyle(navbar, 'padding-block', '1rem');
      } else {
        this.renderer.setStyle(navbar, 'padding-block', '1.25rem');
      }
    }
  }
}
