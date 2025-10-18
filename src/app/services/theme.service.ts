import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {

    public currentTheme$ = new BehaviorSubject<string>("light");

    setDarkTheme(): void {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        this.currentTheme$.next('dark');

    }

    setLightTheme(): void {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        this.currentTheme$.next('light');
    }

    toggleTheme(): void {
        const currentTheme = localStorage.getItem('theme') || 'light';
        if (currentTheme === 'dark') {
            this.setLightTheme();
        } else {
            this.setDarkTheme();
        }

    }

    applySavedTheme(): void {


        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            // Dark mode is enabled
            this.currentTheme$.next("dark");
            document.documentElement.setAttribute('data-theme', "dark");
            localStorage.setItem('theme', 'dark');

        } else {
            const savedTheme = localStorage.getItem('theme') || 'light';
            this.currentTheme$.next(savedTheme);

            document.documentElement.setAttribute('data-theme', savedTheme);
        }

    }
}