import {Component, OnInit} from "@angular/core";
import {WebService} from "../services/web.service";
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import { ActivatedRoute } from "@angular/router";
import {VoteService} from "../services/vote.service";
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit {

  candidateFormGroup: any;
  partyFormGroup: any;
  candidate_list: any = [];
  party_list: any = [];
  currentlyOpenFormId: number | null = null;
  isAdmin: boolean = false;
  showAddPartyForm = false;
  showAddCandidateForm = false;



  constructor(public webService: WebService,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private voteService: VoteService,
              private authService: AuthService) {

  }
  ngOnInit() {
      this.authService.isAdmin$.subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
    });


    this.candidateFormGroup = new FormGroup({
      candidate_firstname: new FormControl('', Validators.required),
      candidate_lastname: new FormControl('', Validators.required),
      party_id: new FormControl('', Validators.required),
      image: new FormControl('', Validators.required),
      constituency_id: new FormControl('', Validators.required),
      statement: new FormControl('', Validators.required)
    });

    this.partyFormGroup = new FormGroup({
      party_name: new FormControl('', Validators.required),
      image: new FormControl('', Validators.required),
      manifesto: new FormControl('', Validators.required)
    });

    this.candidate_list = this.webService.getCandidates();
    this.party_list = this.webService.getParties();
  }


  onCandidateSubmit(candidateData: any, candidate: any) {
  this.webService.updateCandidate({...candidateData, candidate_id: candidate.candidate_id}).subscribe(
    response => {
      console.log('Candidate updated successfully', response);
    },
    error => {
      console.error('Error updating candidate', error);
    }
  );
  }

  onCandidateDelete(candidate: any){
    this.webService.deleteCandidate(candidate.candidate_id).subscribe(
      response => {
        console.log("Candidate Deleted")
      }
    )}

  onPartyDelete(party: any){
  this.webService.deleteParty(party.party_id).subscribe(
    response => {
      console.log("Party Deleted")
    }
  )}

  createCandidateForm(candidate: any) {
    this.candidateFormGroup = new FormGroup({
      candidate_firstname: new FormControl(candidate.candidate_firstname, Validators.required),
      candidate_lastname: new FormControl(candidate.candidate_lastname, Validators.required),
      party_id: new FormControl(candidate.party_id, Validators.required),
      image: new FormControl(candidate.image, Validators.required),
      constituency_id: new FormControl(candidate.constituency_id, Validators.required),
      statement: new FormControl(candidate.statement, Validators.required)
    });
  }
  createPartyForm(party: any) {
    this.partyFormGroup = new FormGroup({
      party_name: new FormControl(party.party_name, Validators.required),
      image: new FormControl(party.image, Validators.required),
      manifesto: new FormControl(party.manifesto, Validators.required)
    });
  }

  onPartySubmit(partyData: any, party: any) {
    this.webService.updateParty({...partyData, party_id: party.party_id}).subscribe(
      response => {
        console.log('Party updated successfully', response);
      },
      error => {
        console.error('Error updating party', error);
      }
  );
  }

  onEditButtonClick(id: number) {
    if (this.currentlyOpenFormId === id) {
      this.currentlyOpenFormId = null;
    } else {
      this.currentlyOpenFormId = id;
    }
  }

  toggleAddPartyForm() {
    this.showAddPartyForm = !this.showAddPartyForm;
  }

  toggleAddCandidateForm() {
    this.showAddCandidateForm = !this.showAddCandidateForm;
  }

  addParty(partyData: any) {
  this.webService.addParty(partyData).subscribe(
    response => {
      console.log('Party added successfully', response);
      this.partyFormGroup.reset();
    },
    error => {
      console.error('Error adding party', error);
    }
  );
  }

  addCandidate(candidateData: any) {
    this.webService.addCandidate(candidateData).subscribe(
      response => {
        console.log('Candidate added successfully', response);
        this.candidateFormGroup.reset();
      },
      error => {
        console.error('Error adding candidate', error);
      }
  );
  }

  resetElection(){
    this.authService.resetElection().subscribe( response => {
      console.log('Election Reset', response);
    })
  }

}
