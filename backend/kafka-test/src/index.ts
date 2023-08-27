import { KafkaConsumer } from "@cakitomakito/moto-moto-common"

const broker = ["localhost:29092"];
const consumerGroupId = 'test-consumer'

const consumer = new KafkaConsumer("motor-events", consumerGroupId, broker);


