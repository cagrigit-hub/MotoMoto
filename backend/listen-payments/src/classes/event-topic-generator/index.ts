import sha3 from "js-sha3";

class EventTopicGenerator {
  constructor(private contractAbi: any) {
    this.contractAbi = contractAbi;
  }

  getEventTopic(eventName: string) {
    const eventAbi = this.contractAbi.find(
      (e: any) => e.name === eventName && e.type === "event"
    );

    if (!eventAbi) {
      throw new Error(`Event ${eventName} not found in the ABI`);
    }

    const eventSignature = `${eventAbi.name}(${eventAbi.inputs
      .map((i: any) => i.type)
      .join(",")})`;

    return "0x" + sha3.keccak_256(eventSignature);
  }
}

export default EventTopicGenerator;
