import { Component, OnInit } from '@angular/core';
import { Observable, Observer, Subscription } from 'rxjs';

@Component({
  selector: 'app-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.css']
})
export class BasicComponent implements OnInit {

  n1: number = 0;
  n2: number = 0;
  s1: string = "";
  s2: string = "";

  subscription1: Subscription;
  subscription2: Subscription;

  constructor() { }

  ngOnInit() {

    this.s1 = 'Initializing';
    this.s2 = 'Initializing';

    const myFirstObservable = new Observable(

      (observable: Observer<number>) => {
        observable.next(1);
        observable.next(2);
        observable.next(3);
        observable.next(4);
        observable.error('Forced Error - value 5 won`t be executed');
        observable.next(5);
        observable.complete();

      }

    );

    myFirstObservable.subscribe(
      (n: number) => console.log(n),
      (err) => console.error(err),
      () => console.log('completed')
    );

    const myInternalObservable = new Observable(

      (observable: Observer<any>) => {
        let i: number = 0;
        let newInterval = setInterval(() => {
          i++;
          console.log("from Observable", i);
          if(i == 10) {
            observable.complete();
          } else if(i % 2 == 0){
            observable.next(i);
          }
        }, 1000);
        return () => clearInterval(newInterval)
      }
    );

    this.subscription1 = myInternalObservable.subscribe(
      (_n: number) => this.n1 = _n,
      (err) => {this.s1 = 'Error: ' + err},
      () => this.s1 = 'Completed'
    );

    this.subscription2 = myInternalObservable.subscribe(
      (_n: number) => this.n2 = _n,
      (err) => {this.s2 = 'Error: ' + err},
      () => this.s2 = 'Completed'
    );

    setTimeout(() => {

      this.subscription1.unsubscribe();
      this.subscription2.unsubscribe();

    }, 4000);

  }

}
