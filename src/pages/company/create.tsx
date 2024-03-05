import React from 'react'
import { CompanyList } from './list'
import { Form, Input, Modal, Select } from 'antd'
import { useModalForm } from '@refinedev/antd';
import { useGo } from '@refinedev/core';
import { useSelect } from '@refinedev/antd';
import { CREATE_COMPANY_MUTATION } from '@/graphql/mutations';
import { USERS_SELECT_QUERY } from '@/graphql/queries';
import SelectOptionWithAvatar from '@/components/select-option-with-avatar';
import { GetFieldsFromList } from '@refinedev/nestjs-query';
import { UsersSelectQuery } from '@/graphql/types';

const Create = () => {
  const go = useGo()

  const goToListPage = () => {
      go({
          to: { resource: 'companies', action: 'list' },
          options: { keepQuery: true },
          type: 'replace',
      })
  }


  const { formProps, modalProps } = useModalForm({
    action: 'create',
    defaultVisible: true,
    resource: 'companies',
    redirect: false,
    mutationMode: 'pessimistic',
    onMutationSuccess: goToListPage,
    meta: {
        gqlMutation: CREATE_COMPANY_MUTATION
    }
  });

  const { selectProps, queryResult } = useSelect<GetFieldsFromList<UsersSelectQuery>>({
    resource: 'users',
    optionLabel: 'name',
    meta:{
        gqlQuery: USERS_SELECT_QUERY
    }
  })


  return (
   <CompanyList>
        <Modal
            {...modalProps}
            mask={true}
            onCancel={goToListPage}
            title="企業登録"
            width={512}
        >
            <Form {...formProps} layout="vertical">
                <Form.Item
                    label="企業名"
                    name="name"
                    rules={[{ required: true }]}
                >
                    <Input placeholder="企業名を入力してください" />
                </Form.Item>
                <Form.Item
                    label="販売主"
                    name="salesOwnerId"
                    rules={[{ required: true }]}
                >
                    <Select
                        placeholder="販売主を選択してください"
                        {...selectProps}
                        options={
                            queryResult?.data?.data.map((user) => ({
                                value: user.id,
                                label: (
                                    <SelectOptionWithAvatar
                                        name={user.name}
                                        avatarUrl={user.avatarUrl ?? undefined} 
                                    />
                                )
                            })) ?? []
                        }
                    />
                </Form.Item>
            </Form>
        </Modal>
   </CompanyList>
  )
}

export default Create