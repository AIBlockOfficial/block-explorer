"use client"
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Logo from '@/app/static/full_logo.svg'
import Link from 'next/link'

export default function Footer() {
    let router = useRouter()
    return (
        <footer className="bg-gray-50 shadow-xl">
            <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    {/** Logo */}
                    {/* <div className="flex flex-shrink-0 items-center"> */}
                    <Image
                        onClick={() => router.push('/')}
                        className="w-48 hover:cursor-pointer"
                        src={Logo}
                        alt="AIBlock Explorer"
                        priority={true}
                    />
                    {/* </div> */}
                    <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
                        <li className='mx-2'>
                            <Link
                                href={'/legal/terms-of-use'}
                                className={'text-gray-800 hover:bg-gray-300 rounded-md px-3 py-2 text-sm font-medium'}>
                                {'Terms of Use'}
                            </Link>
                        </li>
                        <li className='mx-2'>
                            <Link
                                href={'/legal/privacy-policy'}
                                className={'text-gray-800 hover:bg-gray-300 rounded-md px-3 py-2 text-sm font-medium'}>
                                {'Privacy Policy'}
                            </Link>
                        </li>
                        <li className='mx-2'>
                            <Link
                                href={'https://github.com/AIBlockOfficial'}
                                className={'text-gray-800 hover:bg-gray-300 rounded-md px-3 py-2 text-sm font-medium'}>
                                {'GitHub'}
                            </Link>
                        </li>
                        <li className='mx-2'>
                            <Link
                                href={'https://linktr.ee/ai3lock'}
                                className={'text-gray-800 hover:bg-gray-300 rounded-md px-3 py-2 text-sm font-medium'}>
                                {'Socials'}
                            </Link>
                        </li>
                    </ul>
                </div>
                <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />
                <span className="block text-sm text-gray-800 sm:text-center">© 2023 <a href="https://aiblock.ch/" className="text-gray-500 hover:underline">AIBlock™</a>. All Rights Reserved.</span>
            </div>
        </footer>

    )
}

