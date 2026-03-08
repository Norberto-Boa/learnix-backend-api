import { Injectable } from "@nestjs/common";
import type { GradesRepository } from "../grades.repository";
import { PrismaService } from "@/prisma/prisma.service";

@Injectable()
export class PrismaGradesRepository implements GradesRepository{
  constructor(privatte prisma: PrismaService){}


}