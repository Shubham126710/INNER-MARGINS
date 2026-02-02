'use server'

import { db } from '@/lib/db';
import { AboutContent } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function getAboutContent(): Promise<AboutContent> {
    const about = await db.about.findFirst();
    if (!about) {
        return {
            title: 'About Me',
            subtitle: 'The writer behind the words',
            content: '',
            profileImage: '',
            hobbies: []
        };
    }
    
    return {
        title: about.title,
        subtitle: about.subtitle,
        content: about.content,
        profileImage: about.profileImage || undefined,
        hobbies: about.hobbies ? JSON.parse(about.hobbies) : []
    };
}

export async function saveAboutContent(content: AboutContent): Promise<void> {
    const existing = await db.about.findFirst();
    
    const data = {
        title: content.title,
        subtitle: content.subtitle,
        content: content.content,
        profileImage: content.profileImage,
        hobbies: JSON.stringify(content.hobbies)
    };

    if (existing) {
        await db.about.update({
            where: { id: existing.id },
            data
        });
    } else {
        await db.about.create({
            data
        });
    }
    
    revalidatePath('/about');
}
