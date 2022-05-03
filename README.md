# angular-http-cache

## Import
Import Interceptor in your app.module.ts 

### Interceptor Import in app.module.ts

```typescript
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true}
  ],
   ```

To use the HttpContextToken you need to add 
```typescript
 return this.http.get<[]>('/api', {
      context: new HttpContext().set(CACHEABLE, true)
    })
```
To your Dataservice



#### CREDITS TO [Bricewilson Angular HTTP Communitation](https://github.com/bricewilson/angular-http-communication)
