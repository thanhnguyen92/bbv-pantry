import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent {
  status = 404;
  pageTitle = 'Oops! Page not found';
  errorMessage = 'Sorry, but the page you are looking for is not found. Please make sure you have typed the correct Url.';

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.status = parseInt(params.status, 10) || 404;

      if (this.status === 404) {
        return;
      }

      if (params.errorMessage !== undefined) {
        const errorMessage = String(params.errorMessage).trim();
        this.errorMessage = errorMessage;
      }

      if (this.status === 0 && params.message !== '') {
        this.errorMessage = params.message;
      }
    });
  }
}
