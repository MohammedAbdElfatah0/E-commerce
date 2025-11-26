import { MESSAGE } from '@common/constant';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const method = request.method; // GET | POST | PUT | PATCH | DELETE
    const path = request.route.path; // "/category/:id"


    const entity = path.split('/')[1]?.replace(':id', '');

    let action: keyof typeof MESSAGE.Category = 'updated';

    switch (method) {
      case 'POST':
        action = 'created';
        break;
      case 'GET':
        action = 'found';
        break;
      case 'PATCH':
      case 'PUT':
        action = 'updated';
        break;
      case 'DELETE':
        action = 'deleted';
        break;
    }
    return next.handle().pipe(
      map((data: any) => {
        // لو في data.message تبع الرسالة الخاصة
        const customMessage = data?.message;
        if (data && data.message) {
          const { message, ...restData } = data;
          data = restData;
        }
        if (data?.data) {
          data = data.data;
        }
        return {
          success: true,
          message: customMessage ?? MESSAGE[capitalize(entity)]?.[action] ?? null,
          data,
          timestamp: new Date().toISOString(),
          path: request.url,
        };
      })
    );

  }
}

function capitalize(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
