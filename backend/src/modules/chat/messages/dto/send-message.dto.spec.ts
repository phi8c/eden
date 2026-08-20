import 'reflect-metadata';

import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { SendMessageDto } from './send-message.dto';

describe('SendMessageDto', () => {
  it('transforms numeric string values to numbers', async () => {
    const dto = plainToInstance(SendMessageDto, {
      conversationId: '12',
      topicId: '34',
      content: 'hello',
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
    expect(dto.conversationId).toBe(12);
    expect(dto.topicId).toBe(34);
  });
});
