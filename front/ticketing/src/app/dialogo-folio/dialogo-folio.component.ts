import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
//import {Ticket} from '../ticket';
@Component({
  selector: 'app-dialogo-folio',
  templateUrl: './dialogo-folio.component.html',
  styleUrls: ['./dialogo-folio.component.css']
})
export class DialogoFolioComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogoFolioComponent>,
    @ Inject(MAT_DIALOG_DATA) public data: string) {}

  ngOnInit() {
  }

  cancelar() {
    this.dialogRef.close();
  }
}
