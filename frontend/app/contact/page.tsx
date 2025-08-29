import React from "react"
import ContactPageComponent from "@/components/ContactPageComponent"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Contact Us - 3D Database',
  description: 'Get in touch with the 3D Database team. Reach out for support, inquiries, or collaborations regarding 3D printable models and resources.',
  openGraph: {
    title: 'Contact Us - 3D Database',
    description: 'Get in touch with the 3D Database team. Reach out for support, inquiries, or collaborations regarding 3D printable models and resources.',
    type: 'website',
    url: 'https://3ddatabase.com/contact',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us - 3D Database',
    description: 'Get in touch with the 3D Database team. Reach out for support, inquiries, or collaborations regarding 3D printable models and resources.',
  },
};

const contactPage = () => {
    return(
        <>
            <ContactPageComponent />
        </>
    )
}

export default contactPage;