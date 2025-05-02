import './SearchInput.scss'
import {FC} from "react";
import {Input} from "antd";
import { SearchOutlined } from "@ant-design/icons";

interface SearchInputProps {
  onSearch: (value: string)=> void;
  placeholder?: string;
}

export const SearchInput: FC<SearchInputProps> = ({onSearch, placeholder='Поиск...'}) => {
  const SearchHandle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    onSearch(value);
  }

  const onClear = () => {
    onSearch('');
  }

  return(
    <Input
      className={'searchInput'}
      prefix={
        <SearchOutlined className='icon' />
      }
      placeholder={placeholder}
      onChange={SearchHandle}
      allowClear 
      onClear={onClear}
      />
  )
}
