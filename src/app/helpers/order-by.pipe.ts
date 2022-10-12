import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

  transform(input: Array<any>) {
    return input.sort((a,b) => a.id - b.id);
  }

}
