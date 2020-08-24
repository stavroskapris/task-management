import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

describe('UserEntity', () => {
  let user: User;

  beforeEach(() => {
    user = new User();
    user.salt = 'testSalt';
    user.password = 'testPassword';
    bcrypt.hash = jest.fn();
  });

  describe('validatePassword', () => {
    it('returns true as password is valid', async () => {
      bcrypt.hash.mockReturnValue('testPassword');
      expect(bcrypt.hash).not.toHaveBeenCalled();

      const result = await user.validatePassword('123456');

      expect(bcrypt.hash).toHaveBeenCalledWith('123456', 'testSalt');

      expect(result).toBeTruthy();
    });
    it('returns false as password is invalid', async () => {
        bcrypt.hash.mockReturnValue('wrong password');
        expect(bcrypt.hash).not.toHaveBeenCalled();
  
        const result = await user.validatePassword('wrong password');
  
        expect(bcrypt.hash).toHaveBeenCalledWith('wrong password', 'testSalt');
  
        expect(result).toBeFalsy();
    });
  });
});
