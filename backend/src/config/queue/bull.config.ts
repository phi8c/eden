import { registerAs }
from '@nestjs/config';

export default registerAs(

 'queue',

 ()=>({

   host:
    process.env.REDIS_HOST,

   port:
    Number(
      process.env.REDIS_PORT
    )

 })

);