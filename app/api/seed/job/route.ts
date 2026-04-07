// app/api/seed/job/route.ts (tamamen düzeltilmiş)
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hash } from '@node-rs/argon2';

const prisma = new PrismaClient();

export async function POST() {
  try {
    console.log('💼 Seeding Job Portal data...');

    // ==================== TEMİZLİK ====================
    await prisma.applyjob.deleteMany({});
    await prisma.jobbookmark.deleteMany({});
    await prisma.jobskill.deleteMany({});
    await prisma.job_benfits.deleteMany({});
    await prisma.jobtag.deleteMany({});
    await prisma.jobs.deleteMany({});
    await prisma.candidateSkill.deleteMany({});
    await prisma.candidateLanguage.deleteMany({});
    await prisma.experience.deleteMany({});
    await prisma.jobEducation.deleteMany({});
    await prisma.candidate.deleteMany({});
    await prisma.userPlan.deleteMany({});
    await prisma.orderJob.deleteMany({});
    await prisma.userplan.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.jobcategory.deleteMany({});
    await prisma.jobtype.deleteMany({});
    await prisma.salarytype.deleteMany({});
    await prisma.educationid.deleteMany({});
    await prisma.jobrole.deleteMany({});
    await prisma.jobexperienceId.deleteMany({});
    await prisma.tag.deleteMany({});
    await prisma.skill.deleteMany({});
    await prisma.language.deleteMany({});
    await prisma.profession.deleteMany({});
    await prisma.industry.deleteMany({});
    await prisma.organization.deleteMany({});
    await prisma.team.deleteMany({});
    await prisma.city.deleteMany({});
    await prisma.state.deleteMany({});
    await prisma.countryJob.deleteMany({});
    await prisma.plan.deleteMany({});

    // ==================== ÜLKELER ====================
    await prisma.countryJob.createMany({
      data: [
        { name: 'United States' }, { name: 'United Kingdom' }, { name: 'Canada' },
        { name: 'Australia' }, { name: 'Germany' }, { name: 'France' },
        { name: 'Japan' }, { name: 'India' }, { name: 'Singapore' }, { name: 'UAE' },
      ],
    });

    const countryList = await prisma.countryJob.findMany();
    console.log(`✅ ${countryList.length} countries created`);

    // ==================== ŞEHİRLER ====================
    const cities = [];
    const cityNames = ['New York', 'London', 'Toronto', 'Sydney', 'Berlin', 'Paris', 'Tokyo', 'Mumbai', 'Singapore', 'Dubai'];
    for (let i = 0; i < 10; i++) {
      const city = await prisma.city.create({
        data: { name: cityNames[i], countryId: countryList[i % countryList.length].id },
      });
      cities.push(city);
    }
    console.log(`✅ ${cities.length} cities created`);

    // ==================== ENDÜSTRİLER ====================
    await prisma.industry.createMany({
      data: [
        { name: 'Technology', slug: 'technology' }, { name: 'Healthcare', slug: 'healthcare' },
        { name: 'Finance', slug: 'finance' }, { name: 'Education', slug: 'education' },
        { name: 'Retail', slug: 'retail' }, { name: 'Manufacturing', slug: 'manufacturing' },
        { name: 'Construction', slug: 'construction' }, { name: 'Hospitality', slug: 'hospitality' },
        { name: 'Transportation', slug: 'transportation' }, { name: 'Energy', slug: 'energy' },
      ],
    });
    const industries = await prisma.industry.findMany();
    console.log(`✅ ${industries.length} industries created`);

    // ==================== ORGANİZASYONLAR ====================
    await prisma.organization.createMany({
      data: [
        { name: 'Corporation', slug: 'corporation' }, { name: 'LLC', slug: 'llc' },
        { name: 'Partnership', slug: 'partnership' }, { name: 'Non-Profit', slug: 'non-profit' },
        { name: 'Government', slug: 'government' }, { name: 'Startup', slug: 'startup' },
        { name: 'Agency', slug: 'agency' }, { name: 'Franchise', slug: 'franchise' },
      ],
    });
    const organizations = await prisma.organization.findMany();
    console.log(`✅ ${organizations.length} organizations created`);

    // ==================== TAKIMLAR ====================
    await prisma.team.createMany({
      data: [
        { name: 'Executive', slug: 'executive' }, { name: 'Management', slug: 'management' },
        { name: 'Sales', slug: 'sales' }, { name: 'Marketing', slug: 'marketing' },
        { name: 'Engineering', slug: 'engineering' }, { name: 'Product', slug: 'product' },
        { name: 'Design', slug: 'design' }, { name: 'Operations', slug: 'operations' },
      ],
    });
    const teams = await prisma.team.findMany();
    console.log(`✅ ${teams.length} teams created`);

    // ==================== DİLLER ====================
    await prisma.language.createMany({
      data: [
        { name: 'English', slug: 'english' }, { name: 'Spanish', slug: 'spanish' },
        { name: 'French', slug: 'french' }, { name: 'German', slug: 'german' },
        { name: 'Chinese', slug: 'chinese' }, { name: 'Japanese', slug: 'japanese' },
        { name: 'Arabic', slug: 'arabic' }, { name: 'Hindi', slug: 'hindi' },
      ],
    });
    const languages = await prisma.language.findMany();
    console.log(`✅ ${languages.length} languages created`);

    // ==================== YETENEKLER ====================
    await prisma.skill.createMany({
      data: [
        { name: 'JavaScript', slug: 'javascript' }, { name: 'Python', slug: 'python' },
        { name: 'React', slug: 'react' }, { name: 'Node.js', slug: 'nodejs' },
        { name: 'TypeScript', slug: 'typescript' }, { name: 'Java', slug: 'java' },
        { name: 'AWS', slug: 'aws' }, { name: 'Docker', slug: 'docker' },
        { name: 'SQL', slug: 'sql' }, { name: 'MongoDB', slug: 'mongodb' },
      ],
    });
    const skills = await prisma.skill.findMany();
    console.log(`✅ ${skills.length} skills created`);

    // ==================== MESLEKLER ====================
    await prisma.profession.createMany({
      data: [
        { name: 'Software Engineer', slug: 'software-engineer' },
        { name: 'Product Manager', slug: 'product-manager' },
        { name: 'Data Scientist', slug: 'data-scientist' },
        { name: 'DevOps Engineer', slug: 'devops-engineer' },
        { name: 'UI/UX Designer', slug: 'ui-ux-designer' },
        { name: 'Marketing Specialist', slug: 'marketing-specialist' },
        { name: 'Sales Manager', slug: 'sales-manager' },
        { name: 'HR Director', slug: 'hr-director' },
        { name: 'Financial Analyst', slug: 'financial-analyst' },
        { name: 'Operations Manager', slug: 'operations-manager' },
      ],
    });
    const professions = await prisma.profession.findMany();
    console.log(`✅ ${professions.length} professions created`);

    // ==================== İŞ TİPLERİ ====================
    await prisma.jobtype.createMany({
      data: [
        { name: 'Full-time', slug: 'full-time' }, { name: 'Part-time', slug: 'part-time' },
        { name: 'Contract', slug: 'contract' }, { name: 'Internship', slug: 'internship' },
        { name: 'Remote', slug: 'remote' }, { name: 'Hybrid', slug: 'hybrid' },
        { name: 'Freelance', slug: 'freelance' }, { name: 'Temporary', slug: 'temporary' },
      ],
    });
    const jobTypes = await prisma.jobtype.findMany();
    console.log(`✅ ${jobTypes.length} job types created`);

    // ==================== MAAŞ TİPLERİ ====================
    await prisma.salarytype.createMany({
      data: [
        { name: 'Yearly', slug: 'yearly' }, { name: 'Monthly', slug: 'monthly' },
        { name: 'Hourly', slug: 'hourly' }, { name: 'Project-based', slug: 'project-based' },
        { name: 'Commission', slug: 'commission' }, { name: 'Bonus', slug: 'bonus' },
      ],
    });
    const salaryTypes = await prisma.salarytype.findMany();
    console.log(`✅ ${salaryTypes.length} salary types created`);

    // ==================== İŞ KATEGORİLERİ ====================
    await prisma.jobcategory.createMany({
      data: [
        { name: 'Technology', icon: 'code', slug: 'technology' },
        { name: 'Healthcare', icon: 'heart', slug: 'healthcare' },
        { name: 'Finance', icon: 'dollar-sign', slug: 'finance' },
        { name: 'Education', icon: 'book', slug: 'education' },
        { name: 'Marketing', icon: 'trending-up', slug: 'marketing' },
        { name: 'Sales', icon: 'shopping-cart', slug: 'sales' },
        { name: 'Design', icon: 'pen-tool', slug: 'design' },
        { name: 'Customer Service', icon: 'headphones', slug: 'customer-service' },
        { name: 'Human Resources', icon: 'users', slug: 'human-resources' },
        { name: 'Operations', icon: 'settings', slug: 'operations' },
      ],
    });
    const jobCategories = await prisma.jobcategory.findMany();
    console.log(`✅ ${jobCategories.length} job categories created`);

    // ==================== EĞİTİM SEVİYELERİ ====================
    await prisma.educationid.createMany({
      data: [
        { name: 'High School', slug: 'high-school' },
        { name: 'Associate Degree', slug: 'associate-degree' },
        { name: "Bachelor's Degree", slug: 'bachelors-degree' },
        { name: "Master's Degree", slug: 'masters-degree' },
        { name: 'PhD', slug: 'phd' },
        { name: 'Certificate', slug: 'certificate' },
        { name: 'Diploma', slug: 'diploma' },
      ],
    });
    const educationLevels = await prisma.educationid.findMany();
    console.log(`✅ ${educationLevels.length} education levels created`);

    // ==================== ETİKETLER ====================
    await prisma.tag.createMany({
      data: [
        { name: 'Remote', slug: 'remote' }, { name: 'Hybrid', slug: 'hybrid' },
        { name: 'On-site', slug: 'on-site' }, { name: 'Urgent', slug: 'urgent' },
        { name: 'Featured', slug: 'featured' }, { name: 'Entry Level', slug: 'entry-level' },
        { name: 'Senior Level', slug: 'senior-level' }, { name: 'Management', slug: 'management' },
      ],
    });
    const tags = await prisma.tag.findMany();
    console.log(`✅ ${tags.length} tags created`);

    // ==================== İŞ ROLLERİ ====================
    await prisma.jobrole.createMany({
      data: [
        { name: 'Junior', slug: 'junior' }, { name: 'Mid-Level', slug: 'mid-level' },
        { name: 'Senior', slug: 'senior' }, { name: 'Lead', slug: 'lead' },
        { name: 'Manager', slug: 'manager' }, { name: 'Director', slug: 'director' },
      ],
    });
    const jobRoles = await prisma.jobrole.findMany();
    console.log(`✅ ${jobRoles.length} job roles created`);

    // ==================== DENEYİM SEVİYELERİ ====================
    await prisma.jobexperienceId.createMany({
      data: [
        { name: 'Entry Level (0-1 years)', slug: 'entry-level' },
        { name: 'Junior (1-3 years)', slug: 'junior' },
        { name: 'Mid-Level (3-5 years)', slug: 'mid-level' },
        { name: 'Senior (5-8 years)', slug: 'senior' },
        { name: 'Lead (8-10 years)', slug: 'lead' },
        { name: 'Manager (5+ years)', slug: 'manager' },
      ],
    });
    const experienceLevels = await prisma.jobexperienceId.findMany();
    console.log(`✅ ${experienceLevels.length} experience levels created`);

    // ==================== PLANLAR ====================
    await prisma.plan.createMany({
      data: [
        { leble: 'Basic', price: 0, joblimit: 5, featuredjoblimit: 0, highlightjoblimit: 0 },
        { leble: 'Pro', price: 99, joblimit: 20, featuredjoblimit: 5, highlightjoblimit: 3 },
        { leble: 'Business', price: 299, joblimit: 100, featuredjoblimit: 20, highlightjoblimit: 10 },
      ],
    });
    const plans = await prisma.plan.findMany();
    console.log(`✅ ${plans.length} plans created`);

    // ==================== KULLANICILAR ====================
    console.log('\n👤 Creating users...');

    // Admin kullanıcısı
    const adminPassword = await hash('Admin123!', {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
    await prisma.user.upsert({
      where: { email: 'admin@jobportal.com' },
      update: {},
      create: {
        email: 'admin@jobportal.com',
        username: 'admin_job',
        displayName: 'Job Portal Admin',
        name: 'Admin User',
        passwordHash: adminPassword,
        role: 'ADMIN',
        rolejob: 'ADMIN',
        isVerfied: true,
        emailVerified: new Date(),
      },
    });
    console.log(`✅ Admin created: admin@jobportal.com`);

    // Şirket kullanıcıları (10 adet)
    const companyUsers = [];
    for (let i = 0; i < 10; i++) {
      const passwordHash = await hash(`Company${i + 1}123!`, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
      });
      const user = await prisma.user.create({
        data: {
          email: `company${i + 1}@example.com`,
          username: `company_${i + 1}`,
          displayName: `Company Owner ${i + 1}`,
          name: `Owner ${i + 1}`,
          passwordHash: passwordHash,
          role: 'USER',
          rolejob: 'COMPANY',
          isVerfied: true,
          emailVerified: new Date(),
        },
      });
      companyUsers.push(user);
    }
    console.log(`✅ ${companyUsers.length} company users created`);

    // Aday kullanıcıları (10 adet)
    const candidateUsers = [];
    for (let i = 0; i < 10; i++) {
      const passwordHash = await hash(`Candidate${i + 1}123!`, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
      });
      const user = await prisma.user.create({
        data: {
          email: `candidate${i + 1}@example.com`,
          username: `candidate_${i + 1}`,
          displayName: `Candidate ${i + 1}`,
          name: `Candidate ${i + 1}`,
          passwordHash: passwordHash,
          role: 'USER',
          rolejob: 'CANDIDATE',
          isVerfied: true,
          emailVerified: new Date(),
        },
      });
      candidateUsers.push(user);
    }
    console.log(`✅ ${candidateUsers.length} candidate users created`);

    // ==================== ŞİRKETLER ====================
    console.log('\n🏢 Creating companies...');
    
    const companyNames = ['TechCorp', 'HealthPlus', 'FinanceHub', 'EduGlobal', 'RetailKing', 'ManufacturePro', 'BuildRight', 'StayInn', 'MoveFast', 'PowerEnergy'];
    const companies = [];
    
    for (let i = 0; i < companyNames.length; i++) {
      const company = await prisma.company.create({
        data: {
          name: companyNames[i],
          slug: companyNames[i].toLowerCase(),
          userId: companyUsers[i].id,
          bio: `Leading ${industries[i % industries.length].name} company providing innovative solutions.`,
          industryTypeId: industries[i % industries.length].id,
          organizationTypeId: organizations[i % organizations.length].id,
          teamTypeId: teams[i % teams.length].id,
          email: `contact@${companyNames[i].toLowerCase()}.com`,
          cityId: cities[i % cities.length].id,
          isProfileVerified: true,
          profileCompletion: true,
          visibility: true,
        },
      });
      companies.push(company);
      console.log(`✅ Created company: ${company.name}`);
    }

    // ==================== İŞ İLANLARI ====================
    console.log('\n📋 Creating jobs...');
    
    const jobTitles = [
      'Senior Software Engineer', 'Product Manager', 'Data Scientist', 'DevOps Engineer', 
      'UI/UX Designer', 'Marketing Manager', 'Sales Executive', 'HR Generalist', 
      'Financial Analyst', 'Operations Manager'
    ];
    
    const jobs = [];
    for (let i = 0; i < jobTitles.length; i++) {
      // Her iş ilanı için unique slug ve vacancies oluştur
      const uniqueSlug = `${jobTitles[i].toLowerCase().replace(/\s+/g, '-')}-${Date.now()}-${i}`;
      const uniqueVacancies = `${Math.floor(Math.random() * 5) + 1}-${Date.now()}-${i}`;
      
      const job = await prisma.jobs.create({
        data: {
          companyId: companies[i % companies.length].id,
          jobCategoryId: jobCategories[i % jobCategories.length].id,
          jobRoleId: jobRoles[i % jobRoles.length].id,
          jobExperienceId: experienceLevels[i % experienceLevels.length].id,
          educationId: educationLevels[i % educationLevels.length].id,
          jobTypeId: jobTypes[i % jobTypes.length].id,
          salaryTypeId: salaryTypes[i % salaryTypes.length].id,
          title: jobTitles[i],
          slug: uniqueSlug,
          vacancies: uniqueVacancies,
          min_salary: 50000 + Math.floor(Math.random() * 50000),
          max_salary: 80000 + Math.floor(Math.random() * 70000),
          deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          description: `We are looking for an experienced ${jobTitles[i]} to join our dynamic team at ${companies[i % companies.length].name}.`,
          status: 'active',
          cityId: cities[i % cities.length].id,
        },
      });
      jobs.push(job);
      console.log(`✅ Created job: ${job.title}`);
    }

    // ==================== ADAYLAR ====================
    console.log('\n👨‍💼 Creating candidates...');
    
    const candidates = [];
    for (let i = 0; i < candidateUsers.length; i++) {
      const candidate = await prisma.candidate.create({
        data: {
          userId: candidateUsers[i].id,
          professionIds: [professions[i % professions.length].id],
          title: professions[i % professions.length].name,
          full_name: candidateUsers[i].displayName,
          slug: candidateUsers[i].username,
          email: candidateUsers[i].email,
          bio: `Experienced ${professions[i % professions.length].name} with 5+ years of industry experience.`,
          cityId: cities[i % cities.length].id,
          profile_completion: true,
          visibility: true,
        },
      });
      candidates.push(candidate);
      console.log(`✅ Created candidate: ${candidate.full_name}`);
    }

    // ==================== BAŞVURULAR ====================
    console.log('\n📝 Creating job applications...');
    
    let appCount = 0;
    for (const job of jobs) {
      const randomCandidates = [...candidates].sort(() => 0.5 - Math.random()).slice(0, 3);
      for (const candidate of randomCandidates) {
        await prisma.applyjob.create({
          data: { candidateId: candidate.id, jobId: job.id },
        });
        appCount++;
      }
    }
    console.log(`✅ Created ${appCount} job applications`);

    // ==================== FAVORİLER ====================
    console.log('\n⭐ Creating job bookmarks...');
    
    let bookmarkCount = 0;
    for (const candidate of candidates) {
      const randomJobs = [...jobs].sort(() => 0.5 - Math.random()).slice(0, 2);
      for (const job of randomJobs) {
        await prisma.jobbookmark.create({
          data: { candidateId: candidate.id, jobId: job.id },
        });
        bookmarkCount++;
      }
    }
    console.log(`✅ Created ${bookmarkCount} job bookmarks`);

    // ==================== İSTATİSTİKLER ====================
    console.log('\n📊 Job Portal Seeding Summary:');
    console.log(`🌍 Countries: ${countryList.length}`);
    console.log(`🏙️ Cities: ${cities.length}`);
    console.log(`🏭 Industries: ${industries.length}`);
    console.log(`🏢 Organizations: ${organizations.length}`);
    console.log(`👥 Teams: ${teams.length}`);
    console.log(`🗣️ Languages: ${languages.length}`);
    console.log(`⚡ Skills: ${skills.length}`);
    console.log(`💼 Professions: ${professions.length}`);
    console.log(`📋 Job Types: ${jobTypes.length}`);
    console.log(`💰 Salary Types: ${salaryTypes.length}`);
    console.log(`📁 Job Categories: ${jobCategories.length}`);
    console.log(`🎓 Education Levels: ${educationLevels.length}`);
    console.log(`🏷️ Tags: ${tags.length}`);
    console.log(`👔 Job Roles: ${jobRoles.length}`);
    console.log(`📊 Experience Levels: ${experienceLevels.length}`);
    console.log(`📦 Plans: ${plans.length}`);
    console.log(`👤 Admin: 1`);
    console.log(`🏢 Company Users: ${companyUsers.length}`);
    console.log(`👨‍💼 Candidate Users: ${candidateUsers.length}`);
    console.log(`🏢 Companies: ${companies.length}`);
    console.log(`📋 Jobs: ${jobs.length}`);
    console.log(`👨‍💼 Candidates: ${candidates.length}`);
    console.log(`📝 Applications: ${appCount}`);
    console.log(`⭐ Bookmarks: ${bookmarkCount}`);

    return NextResponse.json({
      success: true,
      message: 'Job Portal seeded successfully!',
      stats: {
        countries: countryList.length,
        cities: cities.length,
        industries: industries.length,
        companies: companies.length,
        jobs: jobs.length,
        candidates: candidates.length,
        applications: appCount,
        bookmarks: bookmarkCount,
      },
      credentials: {
        admin: 'admin@jobportal.com / Admin123!',
        company: 'company1@example.com / Company1123!',
        candidate: 'candidate1@example.com / Candidate1123!',
      }
    });

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}