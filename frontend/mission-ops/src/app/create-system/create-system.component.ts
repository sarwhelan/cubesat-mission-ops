import { Component, OnInit, Input } from '@angular/core';
import { System } from '../../classes/system';
import { SystemService } from '../services/system/system.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-system',
  templateUrl: './create-system.component.html',
  styleUrls: ['./create-system.component.scss']
})
export class CreateSystemComponent implements OnInit {
  _selectedSystem: System;
  closeResult:string;

  @Input()
  private get selectedSystem() {
    return this._selectedSystem;
  }
  private set selectedSystem(val: System) {
    this._selectedSystem = val;
  }

  constructor(private systemService: SystemService, private modalService: NgbModal) 
  {
    this._selectedSystem = this._selectedSystem;
  }

  ngOnInit() {
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

}
