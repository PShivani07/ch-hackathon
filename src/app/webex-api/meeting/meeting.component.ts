import { Component, OnDestroy, OnInit } from '@angular/core';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { MeetService } from 'src/app/webex-api/services/meet.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'sm-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.css']
})
export class MeetingComponent implements OnInit, OnDestroy {
  showMsg: boolean = false;
  error: string = '';

  // Subscription
  ms_create!: Subscription;

  // meetingForm: FormGroup;
  // meetingTitle: FormControl;
  // start: FormControl;
  // end: FormControl;
  // attendees: FormControl;

  meetingForm = new FormGroup({
    meetingTitle: new FormControl(null, [
      Validators.required,
      Validators.minLength(4)
    ]),
    start: new FormControl(this.datepipe.transform(new Date(), 'yyyy-MM-ddThh:mm')),
    end: new FormControl(this.datepipe.transform(new Date(), 'yyyy-MM-ddThh:mm')),
    attendees: new FormControl(null, Validators.required)
  });

  get meetingTitle() { return this.meetingForm.get('meetingTitle'); }
  get startTime() { return this.meetingForm.get('start'); }
  get endTime() { return this.meetingForm.get('end'); }
  get attendees() { return this.meetingForm.get('attendees'); }

  get dateLessThan() {
    let f = this.startTime?.value;
    let t = this.endTime?.value;

    const diffInMs = Date.parse(t) - Date.parse(f);
    const diffInHours = diffInMs / 1000 / 60 / 60;
    console.log(f);
    console.log(t);
    if (f >= t) {
      return true;
    } else if (diffInHours >= 6) {
      console.log(diffInHours);
      return true;
    }
    return false;
  }

  get validateEmails() {
    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (this.attendees) {
      for (const invite of this.attendees.value.split(',')) {
        console.log(invite.trim());
        // Check email against our regex to determine if email is valid
        if (!regex.test(invite.trim())) {
          return true;
        }
      }
    }
    return false;
  }

  constructor(
    private datepipe: DatePipe,
    private meetService: MeetService) { 
      // this.meetingTitle = new FormControl(null, [
      //   Validators.required,
      //   Validators.minLength(4)
      // ]);
      // this.start = new FormControl(this.datepipe.transform(new Date(), 'yyyy-MM-ddThh:mm'));
      // this.end = new FormControl(this.datepipe.transform(new Date(), 'yyyy-MM-ddThh:mm'));
      // this.attendees = new FormControl(null, Validators.required);

      // this.meetingForm = new FormGroup({
      //   meetingTitle: this.meetingTitle,
      //   start: this.start,
      //   end: this.end,
      //   attendees: this.attendees
      // })
    }

  ngOnInit(): void {
  }

  onSubmit() {
    console.log(this.meetingForm.value);
    this.ms_create = this.meetService.createMeeting(this.meetingForm.value).subscribe(value => {
      if (value.status === 200) {
        this.showMsg = true;
      }
    });
  }

  ngOnDestroy(): void {
    if(this.ms_create) {
      this.ms_create.unsubscribe();
    }
  }
}
