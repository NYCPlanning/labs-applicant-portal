import { 
  Injectable,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from './contact.entity';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}

  activeContacts() {
    return this.contactRepository.createQueryBuilder('active_contacts')
      .where('active_contacts.statuscode = :statuscode', { statuscode: 'Active' });
  }

  async findOne(opts: any): Promise<Contact> {
    return this.contactRepository.findOneOrFail(opts);
  }

  async findByEmail(email): Promise<Contact> {
    return this.activeContacts()
      .andWhere('emailaddress1 ILIKE :email', { email })
      .getOne();
  }
}
