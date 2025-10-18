import { TestBed } from '@angular/core/testing';

import { UserHasSomeAdminRoleGuard } from './user-has-some-admin-role.guard';

describe('UserHasSomeAdminRoleGuard', () => {
  let guard: UserHasSomeAdminRoleGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UserHasSomeAdminRoleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
