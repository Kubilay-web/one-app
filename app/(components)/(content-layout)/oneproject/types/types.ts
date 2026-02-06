import {
  ProjectStatus,
  TaskStatus,
  Role,
  Payment as IPayment,
  User,
  File,
  Project,
} from "@prisma/client";

export type CategoryProps = {
  title: string;
  slug: string;
  imageUrl: string;
  description: string;
};
export interface ProjectWithPayment extends Project {
  payments: IPayment[];
}
export type UserProps = {
  name: string;
  firstName: string;
  lastName: string;
  phone: string;
  username:string;
  image: string;
  email: string;
  password: string;
  role?: Role;
  userLogo?: string;
  userId?: string;
  country?: string;
  location?: string;
  companyName?: string;
  companyDescription?: string;
};
export type PaymentProps = {
  amount: number;
  // amountLocal: number;
  tax: number;
  date: string;
  title: string;
  invoiceNumber: string;
  method: string;
  projectId: string;
  userId: string;
  clientId: string;
};
export type CommentProps = {
  content: string;
  projectId: string;
  userName: string;
  userRole: Role;
  userId: string;
};
export type ProjectProps = {
  name: string;
  slug: string;
  notes: string;
  description: string;
  bannerImage: string;
  gradient: string;
  thumbnail: string;
  freeDomain: string;
  customDomain: string;
  startDate: any;
  endDate: any;
  status: ProjectStatus;
  clientId: string;
  userId: string;
  budget: number;
  budgetLocal: number;
  deadline: number;
};
export type LoginProps = {
  email: string;
  password: string;
};

export type ProjectData = {
  id: string;
  name: string;
  slug: string;
  notes: string | null;
  description: string | null;
  bannerImage: string | null;
  gradient: string | null;
  freeDomain: string | null;
  customDomain: string | null;
  thumbnail: string | null;
  budget: number | null;
  budgetLocal: number | null;
  deadline: number | null;
  startDate: Date;
  endDate: Date | null;
  status: ProjectStatus;
  clientId: string;
  userId: string;
  modules: Module[];
  comments: ProjectComment[];
  members: Member[];
  invoices: Invoice[];
  payments: Payment[];
  createdAt: Date;
  updatedAt: Date;
  client: ClientData;
  user: User;
};
export type ProjectWithUser = {
  id: string;
  name: string;
  slug: string;
  notes: string | null;
  description: string | null;
  bannerImage: string | null;
  gradient: string | null;
  thumbnail: string | null;
  budget: number | null;
  deadline: number | null;
  startDate: Date;
  endDate: Date | null;
  status: ProjectStatus;
  clientId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
};
export type ProjectWithPayments = {
  id: string;
  name: string;
  slug: string;
  thumbnail: string | null;
  payments: Payment[];
};
export type DetailedUserProjects = ProjectWithPayments[];
export type moduleData = {
  id: string;
  name: string;
  userName: string;
  userId: string;
  projectId: string;
  tasks: Task[];
  createdAt: Date;
  updatedAt: Date;
};

export type Module = {
  id: string;
  name: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
};
export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  moduleId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ProjectComment = {
  id: string;
  content: string;
  projectId: string;
  userName: string;
  userRole: Role;
  createdAt: Date;
  updatedAt: Date;
};
export type ModuleProps = {
  name: string;
  userName: string;
  userId: string;
  projectId: string;
};
export type TaskProps = {
  title: string;
  status: TaskStatus;
  moduleId: string;
};

export type Member = {
  id: string;
  name: string;
  email: string;
  role: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type InvoiceDetails = {
  invoice: IPayment;
  user: IUser | null;
  client: IClient | null;
};
interface IUser {
  name: string;
  phone: string;
  email: string;
  companyName: string;
  companyDescription: string;
  userLogo: string;
}
interface IClient {
  name: string;
  phone: string;
  email: string;
  companyName: string;
  companyDescription: string;
}

export type Invoice = {
  id: string;
  invoiceNumber: string;
  amount: number;
  status: string;
  dueDate: Date;
  projectId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Payment = {
  id: string;
  amount: number;
  date: Date;
  title: string;
  method: string;
  projectId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  invoiceNumber: string;
};

export type ClientData = {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  image: string | null;
  country: string | null;
  location: string | null;
  role: Role;
  plain: string | null;
  companyName: string | null;
  companyDescription: string | null;
};

export type PortfolioProps = {
  userId: string;
  name: string;
  profileImage: string;
  location: string;
  projectCount: number;
  email: string;
  bookingLink: string;
  description: string;
  twitterUrl: string;
  youtubeUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
  githubUrl: string;
};

export interface FolderProps {
  name: string;
  userId: string;
}
export interface FileProps {
  name: string;
  type: string;
  url: string;
  size: number;
  folderId: string;
}
export interface UserFolder {
  id: string;
  name: string;
  userId: string;
  files: File[];
  createdAt: Date;
}
