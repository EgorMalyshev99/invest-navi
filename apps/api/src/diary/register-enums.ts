import { registerEnumType } from '@nestjs/graphql';

import { DiaryAction } from './dto/diary-action.enum';
import { DiaryHorizon } from './dto/diary-horizon.enum';
import { DiaryStatus } from './dto/diary-status.enum';

registerEnumType(DiaryAction, { name: 'DiaryAction' });
registerEnumType(DiaryHorizon, { name: 'DiaryHorizon' });
registerEnumType(DiaryStatus, { name: 'DiaryStatus' });
