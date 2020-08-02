import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { User } from '../_models/user';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedResult } from '../_models/Pagination';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  users: User[];
  user: User = JSON.parse(localStorage.getItem('user'));
  genderList = [{ value: 'male', display: 'Males' }, { value: 'female', display: 'Females' }];
  userParams: any = {};
  pagination: Pagination;
  constructor(private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      // tslint:disable-next-line: no-string-literal
      this.users = data['users'].result;
      this.pagination = data['users'].pagination;
    });

    this.userParams.gender = this.user.gender === 'female' ? 'male' : 'female';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
  }

  pageChanged(event: any): void {
    this.pagination.CurrentPage = event.page;
    this.loadUsers();
  }

  resetFilters() {
    this.userParams.gender = this.user.gender === 'female' ? 'male' : 'female';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.loadUsers();
  }

  loadUsers() {
    this.userService
      .getUsers(this.pagination.CurrentPage, this.pagination.ItemsPerPage, this.userParams)
      .subscribe(
        (res: PaginatedResult<User[]>) => {
          this.users = res.result;
          // this.pagination = res.pagination;
        },
        error => {
          console.log(error);
        }
      );
  }
}
