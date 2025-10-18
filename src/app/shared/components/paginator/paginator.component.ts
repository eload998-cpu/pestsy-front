import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';

@Component({
    selector: 'app-paginator',
    templateUrl: './paginator.component.html',
    styleUrls: ['./paginator.component.scss'],
    standalone: false
})
export class PaginatorComponent 
{
 
public links:any=[];

@Input('data') 
set data(value:any)
{

  if(value.links)
  {
    this.links=value.links;

  }
}

@Output()
public page:EventEmitter<any> = new EventEmitter;


public changePage(url:string)
{
  if(url)
  {
  let value = new URL(url);
  let p = value.searchParams.get("page");
  this.page.emit(p);
  }
}

}
