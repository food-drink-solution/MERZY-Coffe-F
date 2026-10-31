import { BehaviorSubject, Observable } from 'rxjs';
import { BrewMethod, CoffeeOrigin, RoastLevel } from '../models/coffee.model';

@Injectable({ providedIn: 'root' })
export class CoffeeService {
  private origins: CoffeeOrigin[] = [
    { id: 'espresso', country: 'MERZY Coffee', region: 'Espresso', bean: 'Espresso', notes: 'Rich, balanced and carefully extracted.', price: 0, latitude: 0, longitude: 0 },
    { id: 'manual', country: 'MERZY Coffee', region: 'Manual Brew', bean: 'V60', notes: 'A clean, aromatic cup with delicate flavors.', price: 0, latitude: 0, longitude: 0 },
  ];
  private roastLevels: RoastLevel[] = [
    { id: 0, title: 'Light & Bright', description: 'A profile that lets delicate character come forward.', filter: 'brightness(120%) sepia(0.08)' },
    { id: 1, title: 'Balanced', description: 'Round, composed and satisfying.', filter: 'brightness(100%) sepia(0.2)' },
    { id: 2, title: 'Deep & Rich', description: 'A fuller profile for a more intense cup.', filter: 'brightness(80%) sepia(0.4)' },
  ];
  private brewMethods: BrewMethod[] = [
    { id: 'espresso', name: 'Espresso', grindSize: 'Fine', ratio: 'Prepared to order', timing: 'Carefully extracted' },
    { id: 'v60', name: 'V60', grindSize: 'Manual brew', ratio: 'Prepared to order', timing: 'Poured with intention' },
  ];
  private selectedOrigin$ = new BehaviorSubject<CoffeeOrigin | null>(null);
  private selectedRoast$ = new BehaviorSubject<RoastLevel>(this.roastLevels[1]);
  getOrigins(): Observable<CoffeeOrigin[]> { return new Observable(observer => { observer.next(this.origins); observer.complete(); }); }
  getRoastLevels(): Observable<RoastLevel[]> { return new Observable(observer => { observer.next(this.roastLevels); observer.complete(); }); }
  getBrewMethods(): Observable<BrewMethod[]> { return new Observable(observer => { observer.next(this.brewMethods); observer.complete(); }); }
  getRoastById(id: number): RoastLevel | undefined { return this.roastLevels.find(roast => roast.id === id); }
  getBrewMethodById(id: string): BrewMethod | undefined { return this.brewMethods.find(method => method.id === id); }
  setSelectedOrigin(origin: CoffeeOrigin): void { this.selectedOrigin$.next(origin); }
  getSelectedOrigin(): Observable<CoffeeOrigin | null> { return this.selectedOrigin$.asObservable(); }
  setSelectedRoast(roast: RoastLevel): void { this.selectedRoast$.next(roast); }
  getSelectedRoast(): Observable<RoastLevel> { return this.selectedRoast$.asObservable(); }
}
