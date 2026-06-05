import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiPhone, FiMail, FiGlobe, FiInfo } from 'react-icons/fi';

export default function OrganizationCard({ organization }) {
  const [showDetails, setShowDetails] = useState(false);

  const { name, nameRu, phone, email, address, addressRu, website, logo, category } = organization;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden"
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          {logo ? (
            <img src={logo} alt={name} className="object-cover w-16 h-16 rounded-lg" />
          ) : (
            <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10">
              <i className="text-2xl text-primary fas fa-building"></i>
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{name}</h3>
            {nameRu && <p className="text-sm text-gray-500">{nameRu}</p>}
            {category && (
              <span className="inline-block px-2 py-0.5 mt-1 text-xs rounded-full bg-gray-100 text-gray-600">
                {category === 'government' ? 'Davlat tashkiloti' : category === 'education' ? 'Ta\'lim' : category === 'medical' ? 'Tibbiyot' : 'Boshqa'}
              </span>
            )}
          </div>
        </div>

        <div className="grid gap-2 mt-4 text-sm">
          {phone && (
            <div className="flex items-center gap-2 text-gray-600">
              <FiPhone className="w-4 h-4 text-primary" />
              <a href={`tel:${phone}`} className="hover:text-primary">{phone}</a>
            </div>
          )}
          {email && (
            <div className="flex items-center gap-2 text-gray-600">
              <FiMail className="w-4 h-4 text-primary" />
              <a href={`mailto:${email}`} className="hover:text-primary">{email}</a>
            </div>
          )}
          {address && (
            <div className="flex items-start gap-2 text-gray-600">
              <FiMapPin className="w-4 h-4 mt-0.5 text-primary" />
              <span>{address}</span>
            </div>
          )}
          {website && (
            <div className="flex items-center gap-2 text-gray-600">
              <FiGlobe className="w-4 h-4 text-primary" />
              <a href={website} target="_blank" rel="noopener noreferrer" className="hover:text-primary">{website}</a>
            </div>
          )}
        </div>

        {addressRu && (
          <div className="mt-3">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <FiInfo className="w-4 h-4" />
              {showDetails ? 'Yopish' : 'Batafsil'}
            </button>
            {showDetails && (
              <div className="mt-2 p-3 text-sm bg-gray-50 rounded-lg">
                <p className="text-gray-600">{addressRu}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}