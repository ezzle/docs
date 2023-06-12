import { CollectionEntry, defineCollection, z } from 'astro:content';

export const frameSchema = z
    .object({
        frametype: z.literal('frame').optional().default('frame'),
        name: z.string(),
        type: z.string(),
        supertype: z.array(z.string()),
        own_slot_value: z.array(z.object({
            slot_reference: z.string(),
            value: z.array(z.object({
                value_type: z.string(),
                value_content: z.string()
            }))
        })).optional(),
        superclass: z.array(z.string()).optional(),
        template_slot: z.array(z.string()).optional(),
        template_facet_value: z.array(z.object({
            slot_reference: z.string(),
            facet_reference: z.string(),
            value: z.array(z.object({
                value_type: z.string(),
                value_content: z.string()
            }))
        })).optional()
    })
    .strict();

export const classSchema = frameSchema.extend({
    frametype: z.literal('class')
});

export const slotSchema = frameSchema.extend({
    frametype: z.literal('slot')
}).omit({
    //template_slot: true,
    //template_facet_value: true,
    //superclass: true,
});


export const facetSchema = frameSchema.extend({
    frametype: z.literal('facet')
}).omit({
    //template_slot: true,
    //template_facet_value: true,
    //superclass: true,
    //own_slot_value: true
});

const simpleInstanceSchema = frameSchema.extend({
    frametype: z.literal('simple_instance')
}).omit({
    //template_slot: true,
    //template_facet_value: true,
    //superclass: true,
});

export type ClassEntry = CollectionEntry<'essential'> & {
    data: z.infer<typeof classSchema>;
};
export type SlotEntry = CollectionEntry<'essential'> & {
    data: z.infer<typeof slotSchema>;
};
export type FacetEntry = CollectionEntry<'essential'> & {
    data: z.infer<typeof facetSchema>;
};
export type SimpleInstanceEntry = CollectionEntry<'essential'> & {
    data: z.infer<typeof simpleInstanceSchema>;
};

export function isClassEntry(entry: CollectionEntry<'essential'>): entry is ClassEntry {
    return entry.data.frametype === 'class';
}

export function isSlotEntry(entry: CollectionEntry<'essential'>): entry is SlotEntry {
    return entry.data.frametype === 'slot';
}

export function isFacetEntry(entry: CollectionEntry<'essential'>): entry is FacetEntry {
    return entry.data.frametype === 'facet';
}

export function isSimpleInstanceEntry(entry: CollectionEntry<'essential'>): entry is SimpleInstanceEntry {
    return entry.data.frametype === 'simple_instance';
}

export function createIsLangEntry(lang: string) {
    return function isLangEntry(entry: CollectionEntry<'essential'>): boolean {
        return entry.slug.startsWith(lang + '/');
    };
}

export const isEnglishEntry = createIsLangEntry('en');

export const essential = defineCollection({
    schema: z.union([frameSchema, classSchema, slotSchema, facetSchema, simpleInstanceSchema])
}); 