import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useWorkspaceId } from "@/hooks/use-workspace";

interface ChannelHeroProps {
  name: string;
}

const ChannelHeroGeneral = ({ name }: ChannelHeroProps) => {
  const workspaceId = useWorkspaceId();
  const { data: currentMember } = useCurrentMember({ workspaceId });

  //   const { data: member, isLoading: isMemberLoading } = useGetMember({
  //     memberId,
  //   });

  return (
    <div className="mt-[88px] mx-5 mb-4">
      <p className="text-2xl font-bold flex items-center mb-2"># {name}</p>
      <h1 className="text-xl font-bold">
        Slack Clone: A Real-Time Collaboration Platform Overview
      </h1>
      This Slack Clone is a modern, real-time collaboration platform built with
      Next.js, Convex, and TypeScript. It offers a familiar interface for team
      communication, featuring workspaces, channels, and direct messaging
      capabilities.
      <h1 className="text-lg font-bold">Key Features</h1>
      <ul className="list-disc list-inside">
        <li className="text-md font-bold">Workspace Management</li>
        <p>
          Users can create and join workspaces, which serve as the top-level
          organization unit for teams. The workspace creation process is
          streamlined, allowing users to quickly set up their collaborative
          environment.
        </p>
        <li className="text-md font-bold">Channel Communication</li>
        <p>
          {" "}
          Within each workspace, users can create and participate in channels.
          These channels support real-time messaging, file sharing, and threaded
          conversations, facilitating organized discussions on specific topics
          or projects.
        </p>
        <li className="text-md font-bold">Direct Messaging</li>
        <p>
          The platform supports private, one-on-one conversations between team
          members, ensuring confidential communication when needed.
        </p>
        <li className="text-md font-bold">Real-Time Updates</li>
        <p>
          Leveraging Convexs real-time capabilities, messages and updates are
          instantly propagated to all connected clients, ensuring a seamless and
          responsive user experience.
        </p>
        <li className="text-md font-bold">Rich Text Editing</li>
        <p>
          The message editor supports rich text formatting, allowing users to
          express themselves with various text styles, lists, and embedded
          content.
        </p>
        <li className="text-md font-bold">Reactions and Threads</li>
        <p>
          Users can react to messages with emojis and create threaded
          discussions, keeping conversations organized and engaging.
        </p>
        <li className="text-md font-bold">User Authentication</li>
        <p>
          The application implements secure user authentication, ensuring that
          only authorized users can access workspaces and their content.
        </p>
      </ul>
    </div>
  );
};

export default ChannelHeroGeneral;
