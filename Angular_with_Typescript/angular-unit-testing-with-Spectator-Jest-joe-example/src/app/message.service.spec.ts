import { MessageService } from './message.service';
import { SpectatorService , createServiceFactory } from '@ngneat/spectator/jest';

describe('MessageService', () => {
  let service: MessageService;

  beforeEach(() => {
    service = new MessageService();
  });

  // IMPORTANT: since this is an isolated test, we do not need the boilerplate. Y
  // You can disable the above, enable the below, the result is the same

  // let spectator: SpectatorService<MessageService>;
  // let service: MessageService;

  // const createService = createServiceFactory(MessageService);

  // beforeEach(() => {
  //   spectator = createService();
  //   service = spectator.service;
  // });

  it('should have no messages to start', () => {
    expect(service.messages.length).toBe(0);
  });

  it('should add a message when add is called', () => {
    service.add('message1');
    expect(service.messages.length).toBe(1);
  });

  it('should remove all messages when clear is called', () => {
    service.add('message1');
    service.clear();
    expect(service.messages.length).toBe(0);
  });
});
