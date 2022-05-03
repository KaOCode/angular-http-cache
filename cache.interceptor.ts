import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpContextToken
} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {HttpCacheService} from './http-cache.service';
import {tap} from 'rxjs/operators';

export const CACHEABLE = new HttpContextToken(() => true);
@Injectable()
export class CacheInterceptor implements HttpInterceptor {

  constructor(private cacheService: HttpCacheService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // only cache request configured to be cacheable
    if (!request.context.get(CACHEABLE)) {
      next.handle(request);
    }

    // pass alaong non-cachable requests and invalidate cache
    if (request.method !== 'GET') {
      console.log(`Invalidating cache: ${request.method} ${request.url}`);
      this.cacheService.invalidateCache();
      return next.handle(request);
    }
    // attempt to retrieve a cached response
    const cachedResponse: HttpResponse<any> = this.cacheService.get(request.url);
    // return cached response
    if (cachedResponse) {
      console.log(`Returning a cached response: ${cachedResponse.url}`);
      console.log(cachedResponse);
      return of(cachedResponse.clone());
    }
    // rend request to server and add response to cache
    return next.handle(request)
      .pipe(
        tap(event => {
          if (event instanceof HttpResponse) {
            console.log(`Adding item to cache: ${request.url}`);
            this.cacheService.put(request.url, event.clone());
          }
        })
      );
  }
}
