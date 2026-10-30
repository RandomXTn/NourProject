import { z } from "zod";

const emptyToNull = (v: unknown) =>
  v === "" || v === undefined || (typeof v === "number" && Number.isNaN(v))
    ? null
    : v;

const optionalPositiveInt = z.preprocess(
  emptyToNull,
  z.number().int().positive().nullable().optional()
);

export const registerSchema = z
  .object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    email: z.string().email("Adresse e-mail invalide"),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z.string(),
    phone: z
      .string()
      .regex(
        /^(\+216|216)?[2-9]\d{7}$/,
        "Numéro de téléphone tunisien invalide"
      )
      .optional()
      .or(z.literal("")),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Adresse e-mail invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export const addressSchema = z.object({
  firstName: z.string().min(2, "Prénom requis"),
  lastName: z.string().min(2, "Nom requis"),
  phone: z
    .string()
    .regex(/^(\+216|216)?[2-9]\d{7}$/, "Numéro de téléphone invalide"),
  governorate: z.string().min(1, "Gouvernorat requis"),
  city: z.string().min(2, "Ville requise"),
  street: z.string().min(5, "Adresse requise"),
  postalCode: z.string().optional(),
  notes: z.string().optional(),
});

export const checkoutSchema = z.object({
  address: addressSchema,
  shippingMethod: z.string().min(1),
  paymentMethod: z.enum(["CASH_ON_DELIVERY", "KONNECT", "CARD_ONLINE"]),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
  guestEmail: z.string().email().optional(),
});

export const productSchema = z.object({
  name: z.string().min(2),
  nameFr: z.string().optional(),
  nameAr: z.string().optional(),
  slug: z.string().min(2),
  description: z.string().optional(),
  descFr: z.string().optional(),
  descAr: z.string().optional(),
  priceMillimes: z.number().int().positive(),
  salePriceMillimes: optionalPositiveInt,
  categoryId: z.preprocess(emptyToNull, z.string().nullable().optional()),
  isFeatured: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  isNewArrival: z.boolean().default(true),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).default("DRAFT"),
  sku: z.preprocess(emptyToNull, z.string().nullable().optional()),
  material: z.string().optional(),
});

export const couponSchema = z.object({
  code: z.string().min(3).toUpperCase(),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  valueMillimes: optionalPositiveInt,
  percentage: z.preprocess(emptyToNull, z.number().min(1).max(100).nullable().optional()),
  minOrderMillimes: optionalPositiveInt,
  maxUsage: optionalPositiveInt,
  freeShipping: z.boolean().default(false),
  isActive: z.boolean().default(true),
  startsAt: z.preprocess(emptyToNull, z.string().nullable().optional()),
  expiresAt: z.preprocess(emptyToNull, z.string().nullable().optional()),
});

export const reviewSchema = z.object({
  productId: z.string(),
  name: z.string().min(2),
  email: z.string().email().optional(),
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  body: z.string().min(10),
});

export const newsletterSchema = z.object({
  email: z.string().email("Adresse e-mail invalide"),
});
