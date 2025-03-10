import { IServices } from './../../../core/interfaces/iservices';
import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'filterServices'
})
export class FilterServicesPipe implements PipeTransform {
  transform(services: IServices[], searchText: string): IServices[] {
    if (!searchText) {
      return services;
    }
    searchText = searchText.toLowerCase();
    return services.filter(service =>
      service.job.toLowerCase().includes(searchText)
    );
  }
}
