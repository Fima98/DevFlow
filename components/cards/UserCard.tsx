import Link from "next/link";

import ROUTES from "@/constants/routes";

import UserAvatar from "../UserAvatar";

const UserCard = ({ _id, name, image, username }: User) => (
  <div className="shadow-light100_darknone">
    <article className="background-light900_dark200 light-border flex flex-1 basis-[260px] flex-col items-center rounded-2xl border px-8 py-10">
      <UserAvatar
        id={_id}
        name={name}
        imageUrl={image}
        className="size-[100px] rounded-full object-cover"
        fallbackClassName="text-3xl tracking-widest"
      />

      <Link href={ROUTES.PROFILE(_id)}>
        <div className="mt-4 text-center">
          <h3 className="h3-bold text-dark200_light900 line-clamp-1">{name}</h3>
          <p className="body-regular text-dark500_light500">@{username}</p>
        </div>
      </Link>
    </article>
  </div>
);

export default UserCard;
