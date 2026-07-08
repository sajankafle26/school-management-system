import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import WebsiteContent from '@/lib/models/WebsiteContent';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    let content = await WebsiteContent.findOne().lean();
    if (!content) {
      content = await WebsiteContent.create({
        schoolName: 'Shree Adarsha Secondary School',
        logoUrl: 'https://emojicdn.elk.sh/🇳🇵',
        themeColor: '#4f46e5',
        topBar: { showTopBar: true, phone: '+977-1-4412345', email: 'info@adarshaschool.edu.np' },
        home: {
          heroTitle: 'Welcome to Paathshala',
          heroSubtitle: 'Nurturing Minds, Shaping Futures',
          heroImageUrl: 'https://picsum.photos/seed/school-hero/1600/900',
          welcomeTitle: 'A Message from the Principal',
          welcomeMessage: 'It is my pleasure to welcome you to our school\'s official website. We are a community dedicated to academic excellence and the holistic development of every student.',
        },
        about: {
          title: 'Our History and Mission',
          content: 'Founded in 1985, Shree Adarsha Secondary School has a long-standing tradition of academic excellence in Nepal. Our mission is to provide quality education that fosters intellectual and personal growth.',
        },
        contact: {
          address: 'Kathmandu, Nepal',
          phone: '+977-1-4412345',
          email: 'info@adarshaschool.edu.np',
          mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56518.35185998348!2d85.29111344040909!3d27.708942724445834!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb198a307baabf%3A0xb5137c1bf18db1ea!2sKathmandu%2C%20Nepal!5e0!3m2!1sen!2sus!4v1691654321098!5m2!1sen!2sus',
        },
        galleries: [],
      });
      content = content.toObject ? content.toObject() : content;
    }
    return NextResponse.json(content);
  } catch (error) {
    console.error('Website content error:', error);
    return NextResponse.json({
      schoolName: 'Shree Adarsha Secondary School',
      logoUrl: 'https://emojicdn.elk.sh/🇳🇵',
      themeColor: '#4f46e5',
      topBar: { showTopBar: true, phone: '+977-1-4412345', email: 'info@adarshaschool.edu.np' },
      home: {
        heroTitle: 'Welcome to Paathshala',
        heroSubtitle: 'Nurturing Minds, Shaping Futures',
        heroImageUrl: 'https://picsum.photos/seed/school-hero/1600/900',
        welcomeTitle: 'A Message from the Principal',
        welcomeMessage: 'It is my pleasure to welcome you to our school\'s official website.',
      },
      about: {
        title: 'Our History and Mission',
        content: 'Founded in 1985, Shree Adarsha Secondary School has a long-standing tradition of academic excellence in Nepal.',
      },
      contact: {
        address: 'Kathmandu, Nepal',
        phone: '+977-1-4412345',
        email: 'info@adarshaschool.edu.np',
        mapEmbedUrl: '',
      },
      galleries: [],
    });
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    let content = await WebsiteContent.findOne();
    if (content) {
      Object.assign(content, body);
      await content.save();
    } else {
      content = await WebsiteContent.create(body);
    }
    return NextResponse.json(content.toObject ? content.toObject() : content);
  } catch (error) {
    console.error('Website content update error:', error);
    return NextResponse.json({ error: 'Failed to update website content' }, { status: 500 });
  }
}
