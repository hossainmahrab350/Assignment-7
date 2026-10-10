# বাজার দর (BazarDor)

এক নজরে নিত্যপ্রয়োজনীয় পণ্যের সাম্প্রতিক বাজারদর জানার জন্য একটি responsive web application। এটি BazarDor design system অনুসরণ করে তৈরি এবং সরবরাহ করা API থেকে পণ্যের তথ্য নিতে পারে।

## প্রযুক্তি

- Next.js 15 (App Router)
- React 19 ও TypeScript
- Responsive CSS design system
- Browser session-based authentication flow
- BazarDor products API

## বৈশিষ্ট্য

- Figma-inspired দুই সারির navigation, live-style price ticker এবং hero banner
- সব পণ্য, দাম বেড়েছে ও দাম কমেছে—এই তিনটি product view
- Responsive product grid এবং loading skeleton
- Category-wise filtering এবং বাংলা সংখ্যার সঙ্গে সঠিক price sorting
- সুরক্ষিত product-detail page, বাজারভিত্তিক minimum/maximum/average দামসহ
- Sign up, sign in, Google-demo sign in, profile update ও sign out flow
- Invalid product/category এবং অজানা route-এর জন্য friendly empty / 404 state

## চালানো

```bash
npm install
npm run dev
```

তারপর [http://localhost:3000](http://localhost:3000) খুলুন। অ্যাপটি API অপ্রাপ্য হলে প্রদর্শনের জন্য বিল্ট-in product data ব্যবহার করে, ফলে UI ও routes চালু থাকে।
