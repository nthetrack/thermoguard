export const ROLES = {
  ADMIN: 'admin',
  CUSTOMER: 'customer',
  MANAGER: 'manager',
  TECHNICIAN: 'technician',
  RENTAL: 'rental',
}

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Platform Administrator',
  [ROLES.CUSTOMER]: 'Customer',
  [ROLES.MANAGER]: 'Maintenance Manager',
  [ROLES.TECHNICIAN]: 'Service Technician',
  [ROLES.RENTAL]: 'Rental Provider',
}

export const ROLE_COLORS = {
  [ROLES.ADMIN]: 'bg-purple-100 text-purple-800',
  [ROLES.CUSTOMER]: 'bg-blue-100 text-blue-800',
  [ROLES.MANAGER]: 'bg-amber-100 text-amber-800',
  [ROLES.TECHNICIAN]: 'bg-emerald-100 text-emerald-800',
  [ROLES.RENTAL]: 'bg-cyan-100 text-cyan-800',
}

export const defaultUsers = [
  {
    id: 'u1',
    email: 'admin@demo.com',
    password: 'password123',
    name: 'Alex Thompson',
    role: ROLES.ADMIN,
    company: 'ThermoGuard Systems',
    avatar: 'AT',
  },
  {
    id: 'u2',
    email: 'nursinghome@demo.com',
    password: 'password123',
    name: 'Sarah Chen',
    role: ROLES.CUSTOMER,
    company: 'Sunrise Nursing Home',
    avatar: 'SC',
    customerId: 'c1',
  },
  {
    id: 'u3',
    email: '7eleven@demo.com',
    password: 'password123',
    name: 'Mike Rodriguez',
    role: ROLES.CUSTOMER,
    company: '7-Eleven Franchise Group',
    avatar: 'MR',
    customerId: 'c2',
  },
  {
    id: 'u4',
    email: 'manager.nh@demo.com',
    password: 'password123',
    name: 'James Wilson',
    role: ROLES.MANAGER,
    company: 'Sunrise Nursing Home',
    avatar: 'JW',
    customerId: 'c1',
  },
  {
    id: 'u5',
    email: 'tech1@hvacservices.com',
    password: 'password123',
    name: 'David Park',
    role: ROLES.TECHNICIAN,
    company: 'ProCool HVAC Services',
    avatar: 'DP',
    vendorId: 'v1',
  },
  {
    id: 'u6',
    email: 'rentals@coolair.com',
    password: 'password123',
    name: 'Lisa Wang',
    role: ROLES.RENTAL,
    company: 'CoolAir Rentals',
    avatar: 'LW',
    vendorId: 'v2',
  },
]

export const defaultCustomers = [
  {
    id: 'c1',
    name: 'Sunrise Nursing Home',
    address: '42 Wellness Drive, Sydney NSW 2000',
    contactName: 'Sarah Chen',
    contactEmail: 'nursinghome@demo.com',
    contactPhone: '+61 2 9000 1234',
    plan: 'Enterprise',
    devicesCount: 3,
  },
  {
    id: 'c2',
    name: '7-Eleven Franchise Group',
    address: '88 Convenience Lane, Melbourne VIC 3000',
    contactName: 'Mike Rodriguez',
    contactEmail: '7eleven@demo.com',
    contactPhone: '+61 3 9000 5678',
    plan: 'Business',
    devicesCount: 2,
  },
]

export const defaultVendors = [
  {
    id: 'v1',
    name: 'ProCool HVAC Services',
    type: 'technician',
    contactName: 'David Park',
    contactEmail: 'tech1@hvacservices.com',
    contactPhone: '+61 4 1234 5678',
    rating: 4.8,
    responseTime: '45 min avg',
    jobsCompleted: 234,
  },
  {
    id: 'v2',
    name: 'CoolAir Rentals',
    type: 'rental',
    contactName: 'Lisa Wang',
    contactEmail: 'rentals@coolair.com',
    contactPhone: '+61 4 8765 4321',
    rating: 4.6,
    responseTime: '2 hr avg',
    jobsCompleted: 156,
  },
]
