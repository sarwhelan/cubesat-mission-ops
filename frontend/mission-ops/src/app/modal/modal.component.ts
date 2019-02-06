import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

/**
 * A component representing a standard bootstrap modal window with a title, body, and footer.
 * To use this component, insert the following html code into your template:
 *
 * <app-modal>
 *  <ng-container modal-title>
 *    <!-- any html you want to appear in the title bar -->
 *  </ng-container modal-title>
 *  <ng-container modal-body>
 *    <!-- any html you want to appear in the body -->
 *  </ng-container modal-body>
 *  <ng-container modal-footer>
 *    <!-- any html you want to appear in the footer -->
 *  </ng-container modal-footer>
 * </app-modal>
 *
 * Where the comments in the html snippet can be replaced with whatever you want. If you want
 * to use a component in the body and reference it in the footer (e.g. having a form in the 
 * body and a submit button in the footer) you can add a template reference (e.g. #mycomponent)
 * to the tag for your component and then use that as a reference to your component object
 * (e.g. <button (click)="mycomponent.doSomething()"">Click Me</button> in the footer)
 * 
 * @export
 * @class ModalComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @ViewChild('modalContent')
  private modalContent: ElementRef;

  private modalRef: NgbModalRef;

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }

  public open(): Promise<any> {
    this.modalRef = this.modalService.open(this.modalContent);
    
    return this.modalRef.result;
  }

  public dismiss(reason?: any) {
    if (this.modalRef) {
      this.modalRef.dismiss(reason);
    }
  }

  public close(result?: any) {
    if (this.modalRef) {
      this.modalRef.close(result);
    }
  }
}
