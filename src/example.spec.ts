describe('my test', () => {
  it('returns true', () => {
    expect(true).toEqual(true);
  });
});

class FriendsList {
  friends = [];

  addFriend(name: string) {
    this.friends.push(name);
    this.announceFriendship(name);
  }

  announceFriendship(name: string) {
    console.log(`${name} is now a friend!!!`);
  }

  removeFriend(name: string) {
    const idx = this.friends.indexOf(name);

    if (idx == -1) {
      throw new Error('Friend does not exist');
    }

    this.friends.splice(idx, 1);
  }
}

// test FreindsList
describe('FriendsList', () => {
  let friendsList: FriendsList;

  beforeEach(() => {
    friendsList = new FriendsList();
  });

  it('initializes friends list', () => {
    expect(friendsList.friends.length).toEqual(0);
  });

  it('adds a friend to the list', () => {
    friendsList.addFriend('iro');
    expect(friendsList.friends.length).toEqual(1);
  });

  it('announces friendship', () => {
    // mock announceFriendship function
    friendsList.announceFriendship = jest.fn();
    expect(friendsList.announceFriendship).not.toHaveBeenCalled();
    friendsList.addFriend('stavros');
    expect(friendsList.announceFriendship).toHaveBeenCalledWith('stavros');
  });

  describe('removeFriend', () => {
    it('removes a friend from the list', () => {
      friendsList.addFriend('iro');
      expect(friendsList.friends[0]).toEqual('iro');
      const length = friendsList.friends.length;
      friendsList.removeFriend('iro');
      expect(friendsList.friends.length).toEqual(length - 1);
      expect(friendsList.friends[0]).toBeUndefined();
    });

    it('throws error when friend is missing', () => {
      expect(() => friendsList.removeFriend('missing friend')).toThrowError();
      expect(() => friendsList.removeFriend('missing friend')).toThrowError('Friend does not exist');
    });
  });
});
