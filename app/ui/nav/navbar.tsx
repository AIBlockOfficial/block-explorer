"use client"
import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Searchbar from '@/app/ui/nav/searchbar'
import Dropdown from '@/app/ui/nav/dropdown'
import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Logo from '@/app/static/full_logo.svg'
import { fira } from '@/app/styles/fonts'
import { Typography } from '@material-tailwind/react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/ui/tooltip"
import env from '@beam-australia/react-env'

interface NavItems {
  name: string,
  href: string,
  items?: { name: string, href: string }[]
  disabled?: boolean
}

const navigation: NavItems[] = [
  { name: 'Home', href: '/' },
  { name: 'Blocks', href: '/blocks' },
  { name: 'Transactions', href: '/transactions' },
  // {
  //   name: 'Statistics', href: '/statistics', disabled: true, items: [
  //     { name: 'Rich List & Supply', href: '/stats' },
  //     { name: 'Live Nodes', href: '/nodes' },  
  //   ]
  // },
]

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  let router = useRouter()
  const pathname = usePathname()
  const [current, setCurrent] = useState(pathname)
  const [NETWORK, setNetwork] = useState('')
  const [LINK, setLink] = useState('')
  
  useEffect(() => {
    setCurrent(pathname)
    setNetwork(env("NETWORK"))
    setLink(env("OUTLINK"))
  }, [pathname])

  return (
    <Disclosure as="nav" className="bg-gray-200 shadow-xl">
      {({ open }: any) => (
        <>
          <div className="max-w-screen px-2 sm:px-4 lg:px-6">
            <div className="relative flex w-auto h-16 items-center justify-between border">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                {/** Logo */}
                <div className="flex flex-shrink-0 items-center">
                  <Image
                    onClick={() => router.push('/')}
                    className="w-48 hover:cursor-pointer"
                    src={Logo}
                    alt="AIBlock Explorer"
                    priority={true}
                  />
                </div>
                {/** Items */}
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => {
                      if (!item.hasOwnProperty('items') && !item.disabled)
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setCurrent(item.href)}
                            className={classNames(
                              current == item.href ? 'bg-gray-300 text-gray-800' : 'text-gray-800 hover:bg-gray-300',
                              'rounded-md px-3 py-2 text-sm font-medium'
                            )}
                            aria-current={current == item.href ? 'page' : undefined}

                          >
                            {item.name}
                          </Link>)
                      else if (!item.disabled)
                        return item.items ? <Dropdown key={item.name} name={item.name} items={item.items} /> : []
                      else if (item.disabled)
                        return (
                          <Link
                            key={item.name}
                            href={'#'}
                            onClick={() => setCurrent(item.href)}
                            className={' text-gray-400 rounded-md px-3 py-2 text-sm font-medium cursor-default'}
                            aria-current={current == item.href ? 'page' : undefined}

                          >
                            {item.name}
                          </Link>)
                    })}
                  </div>
                </div>
              </div>
              {/** Right Items */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 justify-self-end">
                <div className=" min-w-0 mr-4">
                  <Searchbar />
                </div>
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className={`px-2 flex flex-row ${NETWORK == 'Mainnet' ? 'bg-green-200 ' : 'bg-orange-200'} rounded-sm`}>
                        <a href={LINK}>
                          <TooltipContent>
                            {`Click here to change to `} <b>{NETWORK == 'Mainnet' ? 'Testnet' : 'Mainnet'}</b>
                          </TooltipContent>
                          <Typography variant='small' className={`w-fit ${NETWORK == 'Mainnet' ? 'text-green-900' : 'text-orange-900'} text-center ${fira.className} px-1`}>
                           {NETWORK ? NETWORK.toUpperCase() : ''}
                          </Typography>
                        </a>
                      </div>
                    </TooltipTrigger>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>

          {/** Mobile Menu */}
          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  href={item.href}
                  onClick={() => setCurrent(item.href)}
                  className={classNames(
                    current == item.href ? 'bg-gray-300 text-gray-800' : 'text-gray-800 hover:bg-gray-300',
                    'block rounded-md px-3 py-2 text-base font-medium'
                  )}
                  aria-current={current == item.href ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )
      }
    </Disclosure >
  )
}
